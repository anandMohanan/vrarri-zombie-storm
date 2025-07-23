'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const isValidPhone = (value: string): boolean => /^[\d\s\-()+]*\d[\d\s\-()+]*$/.test(value.trim());

// Zod schema
const formSchema = z.object({
    name: z.string().min(1, '名前は必須です / Name is required.'),
    email: z
        .string()
        .email('有効なメールアドレスを入力してください / Invalid email address.'),
    phone: z
        .string()
        .min(1, '電話番号は必須です / Phone number is required.')
        .refine(isValidPhone, {
            message: '電話番号に無効な文字が含まれています / Invalid characters in phone number.',
        }),
    dateOfBirth: z.date({
        required_error:
            '生年月日を選択してください / Date of birth is required.',
    }),
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
        message: '性別を選択してください / Please select a gender.',
    }),
});

export default function UserDetailsStep() {
    const { currentPlayer, updateCurrentPlayer, setCurrentStep } =
        useAppStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: currentPlayer.name || '',
            email: currentPlayer.email || '',
            phone: currentPlayer.phone || '',
            dateOfBirth: currentPlayer.dateOfBirth
                ? new Date(currentPlayer.dateOfBirth)
                : undefined,
            gender: currentPlayer.gender || undefined,
        },
    });

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (name && type === 'change') {
                const updatedValue = { ...value };
                if (updatedValue.dateOfBirth instanceof Date) {
                    updatedValue.dateOfBirth = updatedValue.dateOfBirth
                        .toISOString()
                        .split('T')[0];
                }
                updateCurrentPlayer(updatedValue);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, updateCurrentPlayer]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const submittedValues = { ...values };
        if (submittedValues.dateOfBirth instanceof Date) {
            submittedValues.dateOfBirth = format(submittedValues.dateOfBirth, 'yyyy-MM-dd');
        }
        updateCurrentPlayer(submittedValues);
        setCurrentStep('confirmation');
    }

    return (
        <StepLayout
            showHeader={true}
            showTeamNumber={true}
            showPlayerIndicator={true}
        >
            <div className="space-y-8">
                {/* Title */}
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-bold text-gray-900">
                        プレイヤー情報の登録
                    </h1>
                    <p className="text-gray-600">Player Information Registration</p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        名前 / Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Taro"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        メールアドレス（プレイ動画送付用）/ Email address (for
                                        receiving your play video)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="player@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        電話番号 / Phone number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="+81 80-1234-5678"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date of Birth and Gender Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Date of Birth */}
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-2">
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            生年月日 / Date of birth
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'PPP')
                                                        ) : (
                                                            <span>日付を選択 / Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    captionLayout='dropdown'
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date < new Date('1900-01-01')
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gender */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            性別 / Gender
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="選択してください / Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">男性 / Male</SelectItem>
                                                <SelectItem value="female">
                                                    女性 / Female
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    その他 / Other
                                                </SelectItem>
                                                <SelectItem value="prefer-not-to-say">
                                                    回答しない / Prefer not to say
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-center pt-6">
                            <Button
                                type="submit"
                                size="lg"
                                className="rounded-md bg-black px-12 py-4 text-lg font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:bg-gray-300"
                            >
                                Next
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </StepLayout>
    );
}
