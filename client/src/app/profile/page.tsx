import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// プロフィールのバリデーションスキーマ
const profileSchema = z.object({
  firstName: z.string().min(1, '名を入力してください'),
  lastName: z.string().min(1, '姓を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().min(1, '有効な年齢を入力してください'),
  occupation: z.string().optional(),
  bio: z.string().max(500, '自己紹介は500文字以内で入力してください').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileEditScreen: React.FC = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      occupation: '',
      bio: '',
    },
  });

  function onSubmit(values: ProfileFormValues) {
    // ここでプロフィールを保存するAPI呼び出しなどを行う
    console.log(values);
  }

  return (
    <div className="profile-edit-screen container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名</FormLabel>
                <FormControl>
                  <Input placeholder="名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓</FormLabel>
                <FormControl>
                  <Input placeholder="姓" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="メールアドレス" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年齢</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="年齢" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>職業</FormLabel>
                <FormControl>
                  <Input placeholder="職業" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自己紹介</FormLabel>
                <FormControl>
                  <Textarea placeholder="自己紹介" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  500文字以内で入力してください
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">保存</Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditScreen;