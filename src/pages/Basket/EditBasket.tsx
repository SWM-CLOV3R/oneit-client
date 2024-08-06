import {fetchBasketInfo} from '@/api/basket';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {useQuery} from '@tanstack/react-query';
import {
    CalendarCheck,
    CalendarIcon,
    ChevronLeft,
    LockKeyhole,
    LockKeyholeOpen,
} from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {z} from 'zod';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar} from '@/components/ui/calendar';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {useAtom} from 'jotai';
import {
    accessStatus,
    basketDeadline,
    basketDescription,
    basketName,
    imageUrl,
    thumbnail,
} from '@/atoms/basket';
import {Spinner} from '@/components/ui/spinner';
import {Separator} from '@/components/ui/separator';

const EditBasket = () => {
    const {basketID} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const {data, isLoading, isError} = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const [title, setTitle] = useAtom(basketName);
    const [description, setDescription] = useAtom(basketDescription);
    const [imageURL, setImageURL] = useAtom(imageUrl);
    const [image, setImage] = useAtom(thumbnail);
    const [access, setAccess] = useAtom(accessStatus);
    const [deadline, setDeadline] = useAtom(basketDeadline);

    const formSchema = z.object({
        title: z
            .string()
            .min(2, {
                message: '바구니 이름은 2자 이상이어야합니다.',
            })
            .max(10, {
                message: '바구니 이름은 10자 이하여야합니다.',
            }),
        description: z.string().optional(),
        image: z.instanceof(File).optional(),
        access: z.enum(['PUBLIC', 'PRIVATE']),
        deadline: z.date({
            required_error: '날짜를 선택해주세요.',
        }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title,
            description,
            access,
        },
        mode: 'all',
    });

    const fileRef = form.register('image');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {reset} = form;

    const handleGoBack = () => {
        navigate('/basket/' + basketID);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log(imageURL);

        setTitle(values.title);
        setDescription(values.description || '');
        values.description;
        setAccess(values.access);
        setImage(values.image || null);
        console.log(values);
        setDeadline(values.deadline);
        try {
            // const id: number = await makeBasket();
            // if (id) {
            //     navigate(`/basket/${id}`);
            // } else {
            //     throw new Error('바구니 생성에 실패했습니다.');
            // }
        } catch (e) {
            console.log(e);
            setError(true);
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        if (data) {
            console.log(data);

            setTitle(data.name || '');
            setDescription(data.description || '');
            setAccess(data.access || 'PUBLIC');
            setDeadline(data.deadline || null);
            setImageURL(data.imageUrl || 'https://via.placeholder.com/200');
            reset({
                title: data.name || '',
                description: data.description || '',
                access: data.access || 'PUBLIC',
                deadline: data.deadline || null,
            });
        }
    }, [data, reset]);

    if (isLoading) return <Spinner />;

    return (
        <>
            <div className="w-full pb-5">
                <div className="flex py-3 flex-wrap items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        className=""
                        onClick={handleGoBack}
                    >
                        <ChevronLeft className="" />
                    </Button>
                </div>

                <div className="flex justify-center w-full">
                    <img
                        onClick={handleAvatarClick}
                        src={
                            data?.imageUrl || 'https://via.placeholder.com/200'
                        }
                        alt="recommended product"
                        // width={200}
                        // height={200}
                        className="object-cover group-hover:opacity-50 transition-opacity"
                    />
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                    >
                        <>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-start">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({field}) => (
                                            <FormItem className="flex">
                                                <FormLabel className="flex">
                                                    이름
                                                </FormLabel>
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
                                        name="image"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...fileRef}
                                                        ref={fileInputRef}
                                                        onChange={(event) => {
                                                            const displayUrl: string =
                                                                URL.createObjectURL(
                                                                    event.target
                                                                        .files![0],
                                                                );

                                                            setImageURL(
                                                                displayUrl,
                                                            );
                                                            console.log(event);
                                                            const file =
                                                                event.target
                                                                    .files![0];
                                                            console.log(file);

                                                            field.onChange(
                                                                file,
                                                            );
                                                        }}
                                                        type="file"
                                                        accept="image/*"
                                                        style={{
                                                            display: 'none',
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="access"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormMessage />
                                                <ToggleGroup
                                                    type="single"
                                                    className="flex gap-2"
                                                    onChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <ToggleGroupItem
                                                        value="PUBLIC"
                                                        size="sm"
                                                    >
                                                        <LockKeyholeOpen />
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem
                                                        value="PRIVATE"
                                                        size="sm"
                                                    >
                                                        <LockKeyhole />
                                                    </ToggleGroupItem>
                                                </ToggleGroup>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({field}) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-[280px] justify-start text-left font-normal',
                                                        !deadline &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {deadline ? (
                                                        format(deadline, 'PPP')
                                                    ) : (
                                                        <span>
                                                            마감일을 골라주세요
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    {...fileRef}
                                                    ref={fileInputRef}
                                                    onChange={(event) => {
                                                        const displayUrl: string =
                                                            URL.createObjectURL(
                                                                event.target
                                                                    .files![0],
                                                            );

                                                        setImageURL(displayUrl);
                                                        console.log(event);
                                                        const file =
                                                            event.target
                                                                .files![0];
                                                        console.log(file);

                                                        field.onChange(file);
                                                    }}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{
                                                        display: 'none',
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                            <Textarea
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="선물의 목적이나 바구니에 담을 선물을 설명해주세요"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit">수정하기</Button>
                            </div>
                        </>
                    </form>
                </Form>
            </div>
            {(isError || error) && (
                <Dialog open={error} onOpenChange={setError}>
                    <DialogContent
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e: {
                            preventDefault: () => void;
                        }) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>문제 발생</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            문제가 발생했습니다. 다시 시도해주세요.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setError(false);
                                    navigate('/');
                                }}
                            >
                                메인으로
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setError(false);
                                }}
                            >
                                다시시도
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default EditBasket;
