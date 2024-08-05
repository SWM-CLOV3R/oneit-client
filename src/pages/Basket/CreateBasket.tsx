import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAtom} from 'jotai';
import {useState} from 'react';
import {basketName, basketDescription, basketDeadline} from '@/atoms/basket';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

interface TitleInputProps {
    setCurrentStep: (step: string) => void;
}

const TitleInput = ({setCurrentStep}: TitleInputProps) => {
    const [title, setTitle] = useAtom(basketName);
    const [description, setDescription] = useAtom(basketDescription);
    const formSchema = z.object({
        title: z.string().min(2, {
            message: '바구니 이름은 2자 이상이어야합니다.',
        }),
        description: z.string(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title,
            description,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setTitle(values.title);
        setDescription;
        values.description;
        setCurrentStep('deadline');
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>바구니 이름</FormLabel>
                            <FormMessage />
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="ex) 00의 생일 선물 바구니"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                바구니 설명 <span>(선택)</span>
                            </FormLabel>
                            <FormMessage />
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="선물의 목적이나 바구니에 담을 선물을 설명해주세요"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">다음</Button>
                </div>
            </form>
        </Form>
    );
};
interface DeadlineInputProps {
    setCurrentStep: (step: string) => void;
}

const DeadlineInput = ({setCurrentStep}: DeadlineInputProps) => {
    const [deadline, setDeadline] = useAtom(basketDeadline);
    const formSchema = z.object({
        deadline: z.date({
            required_error: '날짜를 선택해주세요.',
        }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //     deadline,
        // },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setDeadline(values.deadline);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                언제까지 선물을 골라야 하나요?
                            </FormLabel>
                            <FormMessage />
                            <FormControl>
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                ></FormField>
                <div className="flex justify-end gap-2">
                    <Button onClick={() => setCurrentStep('title')}>
                        이전
                    </Button>
                    <Button type="submit">만들기</Button>
                </div>
            </form>
        </Form>
    );
};

const CreateBasket = () => {
    const [currentStep, setCurrentStep] = useState('title');

    return (
        <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
            <p className="text-center">새 바구니 만들기</p>
            {currentStep === 'title' && (
                <TitleInput setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 'deadline' && (
                <DeadlineInput setCurrentStep={setCurrentStep} />
            )}
        </div>
    );
};

export default CreateBasket;
