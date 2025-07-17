import * as React from 'react';
import { View, TextInput, TouchableOpacity, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '~/lib/utils';
import {Button} from "~/components/ui/button";

type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry'> & {
    placeholderClassName?: string;
};

const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>(
    ({ className, placeholderClassName, editable = true, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <View className={cn('relative rounded-md', className)}>
                <TextInput
                    ref={ref}
                    secureTextEntry={!showPassword}
                    editable={editable}
                    className={cn(
                        'web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 pr-10',
                        !editable && 'opacity-50 web:cursor-not-allowed'
                    )}
                    placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
                    {...props}
                />
                <Button
                    disabled={!editable}
                    className={cn(
                        'bg-transparent absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2 rounded-md items-center justify-center',
                        !editable && 'opacity-50'
                    )}
                    onPress={() => setShowPassword((prev) => !prev)}
                >
                    {showPassword ? (
                        <Eye size={18} className="text-foreground" />
                    ) : (
                        <EyeOff size={18} className="fill-primary" />
                    )}
                </Button>
            </View>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };