// main.go
package main

import (
    "log"
    "net/http"

    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

type Client struct {
    conn *websocket.Conn
    send chan []byte
}

var (
    clients   = make(map[*Client]bool)
    broadcast = make(chan []byte)
    register  = make(chan *Client)
    unregister = make(chan *Client)
)

func main() {
    http.HandleFunc("/ws", handleConnections)
    go handleMessages()

    log.Println("Server starting on :8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatal(err)
        return
    }

    client := &Client{conn: ws, send: make(chan []byte, 256)}
    register <- client

    go client.writePump()
    client.readPump()
}

func (c *Client) readPump() {
    defer func() {
        unregister <- c
        c.conn.Close()
    }()

    for {
        _, message, err := c.conn.ReadMessage()
        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
                log.Printf("error: %v", err)
            }
            break
        }
        broadcast <- message
    }
}

func (c *Client) writePump() {
    defer func() {
        c.conn.Close()
    }()

    for {
        select {
        case message, ok := <-c.send:
            if !ok {
                c.conn.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }

            w, err := c.conn.NextWriter(websocket.TextMessage)
            if err != nil {
                return
            }
            w.Write(message)

            if err := w.Close(); err != nil {
                return
            }
        }
    }
}

func handleMessages() {
    for {
        select {
        case client := <-register:
            clients[client] = true
        case client := <-unregister:
            if _, ok := clients[client]; ok {
                delete(clients, client)
                close(client.send)
            }
        case message := <-broadcast:
            for client := range clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(clients, client)
                }
            }
        }
    }
}