import AuthLayout from "~/features/auth/components/auth-layout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Link} from "expo-router";
import {Text} from "~/components/ui/text";
import {View} from "react-native";
import SignInForm from "~/features/auth/components/sign-in/sign-in-form";

const SignIn = () => {
    return (
        <AuthLayout>
            <View className='gap-4'>
                <CardHeader>
                    <CardTitle className='text-lg tracking-tight'>Login</CardTitle>
                    <CardDescription>
                        Enter your email and password below to
                        log into your account. Don't have account? {" "}
                        <Link href={'/sign-up'} className='text-sm text-muted-foreground underline'>
                            Sign up
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignInForm />
                </CardContent>
                <CardFooter>
                    <Text className='text-muted-foreground px-8 text-center text-sm'>
                        By clicking login, you agree to our{' '}
                        <Link
                            href='/sign-in'
                            className='hover:text-primary underline underline-offset-4'
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href='/sign-in'
                            className='hover:text-primary underline underline-offset-4'
                        >
                            Privacy Policy
                        </Link>
                        .
                    </Text>
                </CardFooter>
            </View>
        </AuthLayout>
    );
};

export default SignIn;