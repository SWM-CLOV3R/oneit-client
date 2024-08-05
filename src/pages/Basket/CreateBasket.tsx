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

type TitleInputProps = {
    setCurrentStep: (step: string) => void;
};

const TitleInput = ({setCurrentStep}: TitleInputProps) => {
    const [title, setTitle] = useAtom(basketName);
    const formSchema = z.object({
        title: z.string().min(2, {
            message: '바구니 이름은 2자 이상이어야합니다.',
        }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setTitle(values.title);
        setCurrentStep('description');
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
                ></FormField>
                <div className="flex justify-end">
                    <Button type="submit">다음</Button>
                </div>
            </form>
        </Form>
    );
};

const CreateBasket = () => {
    const [currentStep, setCurrentStep] = useState('title');
    const [description, setDescription] = useAtom(basketDescription);
    const [deadline, setDeadline] = useAtom(basketDeadline);

    return (
        <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
            <p className="text-center">새 바구니 만들기</p>
            {currentStep === 'title' && (
                <TitleInput setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 'description' && (
                <>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">바구니 설명</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="선물의 목적이나 바구니에 담을 선물을 설명해주세요"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setCurrentStep('title')}>
                            이전
                        </Button>
                        <Button onClick={() => setCurrentStep('deadline')}>
                            다음
                        </Button>
                    </div>
                </>
            )}
            {currentStep === 'deadline' && (
                <>
                    <div>
                        <Label htmlFor="deadline">
                            언제까지 선물을 골라야할까요?
                        </Label>
                        <Calendar
                            mode="single"
                            selected={deadline}
                            onSelect={(val) => setDeadline(val || new Date())}
                            initialFocus
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setCurrentStep('description')}>
                            이전
                        </Button>
                        <Button onClick={() => setCurrentStep('confirm')}>
                            확인
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateBasket;
