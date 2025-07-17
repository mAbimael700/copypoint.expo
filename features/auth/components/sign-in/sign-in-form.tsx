import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {SignInformSchema, SignInFormValues} from "~/features/auth/components/sign-in/sign-in-schema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {View} from "react-native";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {PasswordInput} from "~/components/ui/password-input";
import {useAuth} from "~/features/auth/store/AuthStore";
import {useRouter} from "expo-router";


const SignInForm = () => {
    const {login, isAuthenticated} = useAuth()
    const router = useRouter();

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(SignInformSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmit = async (data: SignInFormValues) => {
        const {email, password} = data
        const success = await login(email, password)
        if (success) {
            router.replace('/(app)/sales');
        }
    }

    // Función que se ejecuta cuando hay errores
    const onError = (errors: any) => {
        console.log('Errores del formulario:', errors)

    }

    return (
        <Form {...form}>
            <View className={"flex flex-col gap-4"}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingresa tu email"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Ingresa tu password"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button
                    onPress={form.handleSubmit(onSubmit, onError)}
                    disabled={form.formState.isSubmitting}
                >
                    <Text>Sign in</Text>
                </Button>
            </View>
        </Form>
    );
};

export default SignInForm;