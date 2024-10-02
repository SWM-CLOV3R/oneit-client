import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';

const SignUp = () => {
    // 이름, 닉네임, 비밀번호, 이메일, 전화번호, 생년월일, 성별
    const formSchema = z.object({
        name: z.string().min(2, {message: '이름은 2자 이상이어야 합니다.'}),
        nickname: z
            .string()
            .min(2, {message: '닉네임은 2자 이상이어야 합니다.'}),
        // email: z
        //     .string()
        //     .email({message: '유효한 이메일 주소를 입력해주세요.'}),
        // password: z
        //     .string()
        //     .min(8, {message: '비밀번호는 8자 이상이어야 합니다.'}),
        // phoneNumber: z.string().regex(/^01[0-9]{8,9}$/, {
        //     message: '유효한 전화번호를 입력해주세요.',
        // }),
        birthDay: z.string().refine(
            (value) => {
                if (value === '--') return true;
                const [year, month, day] = value.split('-');
                if (!year || !month || !day) return true;
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            {
                message: '생년월일은 YYYY-MM-DD 형식이어야 합니다.',
            },
        ),
        gender: z.enum(['MALE', 'FEMALE']),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            nickname: '',
            // email: '',
            // password: '',
            // phoneNumber: '',
            birthDay: '--',
            gender: 'MALE',
        },
        mode: 'all',
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
            <p className="text-center">ONE!T 회원가입</p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>이름</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="이름을 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nickname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>닉네임</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="닉네임을 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="이메일을 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>비밀번호</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}
                    {/* <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>전화번호</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="전화번호를 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}
                    <FormField
                        control={form.control}
                        name="birthDay"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>생년월일</FormLabel>
                                <FormControl>
                                    <div className="flex space-x-2">
                                        <Select
                                            onValueChange={(value) => {
                                                const [_, month, day] =
                                                    field.value.split('-');
                                                field.onChange(
                                                    `${value}-${month || ''}-${day || ''}`,
                                                );
                                            }}
                                            value={
                                                field.value.split('-')[0] || ''
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="년도" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {length: 100},
                                                    (_, i) =>
                                                        new Date().getFullYear() -
                                                        i,
                                                ).map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            onValueChange={(value) => {
                                                const [year, _, day] =
                                                    field.value.split('-');
                                                field.onChange(
                                                    `${year || ''}-${value.padStart(2, '0')}-${day || ''}`,
                                                );
                                            }}
                                            value={
                                                field.value.split('-')[1] || ''
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="월" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {length: 12},
                                                    (_, i) => i + 1,
                                                ).map((month) => (
                                                    <SelectItem
                                                        key={month}
                                                        value={month
                                                            .toString()
                                                            .padStart(2, '0')}
                                                    >
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            onValueChange={(value) => {
                                                const [year, month, _] =
                                                    field.value.split('-');
                                                field.onChange(
                                                    `${year || ''}-${month || ''}-${value.padStart(2, '0')}`,
                                                );
                                            }}
                                            value={
                                                field.value.split('-')[2] || ''
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="일" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {length: 31},
                                                    (_, i) => i + 1,
                                                ).map((day) => (
                                                    <SelectItem
                                                        key={day}
                                                        value={day
                                                            .toString()
                                                            .padStart(2, '0')}
                                                    >
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </FormControl>
                                {field.value !== '--' &&
                                    field.value
                                        .split('-')
                                        .every((part) => part !== '') && (
                                        <FormMessage />
                                    )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({field}) => (
                            <FormItem className="flex items-center gap-8">
                                <FormLabel className="min-w-[60px]">
                                    성별
                                </FormLabel>
                                <div className="flex flex-col">
                                    <FormMessage />
                                    <FormControl>
                                        <ToggleGroup
                                            type="single"
                                            onValueChange={field.onChange}
                                            defaultValue="MALE"
                                            className="flex gap-2"
                                        >
                                            <ToggleGroupItem value="MALE">
                                                남성
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="FEMALE">
                                                여성
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">가입하기</Button>
                </form>
            </Form>
        </div>
    );
};

export default SignUp;
