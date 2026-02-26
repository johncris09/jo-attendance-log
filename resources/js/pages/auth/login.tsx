import { Form } from '@inertiajs/react';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import logo from './../../../image/logo.png';

export const metadata = {
    title: 'Login - Job Order Attendance Log',
    description: 'Secure login for Job Order Attendance Log management system',
};
type Props = {
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    canResetPassword,
    canRegister,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const features = [
        'Real-time attendance tracking',
        'Secure job order management',
        'Comprehensive reporting',
        'Team collaboration tools',
    ];

    return (
        <div className="flex min-h-screen bg-background">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-accent to-secondary p-12 text-primary-foreground lg:flex lg:w-1/2">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-48 -mr-48 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-40 -ml-40 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-12 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                            <img
                                src={logo}
                                alt="BRGY CSM Logo"
                                className="size-10 rounded-md object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">JO Attendance Log</h1>
                            <p className="text-sm text-primary-foreground/80">
                                Attendance Management
                            </p>
                        </div>
                    </div>

                    <div className="max-w-sm">
                        <h2 className="mb-6 text-5xl leading-tight font-bold text-balance">
                            Streamline Your Workforce Management
                        </h2>
                        <p className="mb-8 text-lg leading-relaxed text-primary-foreground/90">
                            Efficient job order tracking and attendance logging
                            for modern teams. Simplify payroll, improve
                            accountability, and boost productivity.
                        </p>

                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle className="h-5 w-5 shrink-0" />
                                    <span className="text-primary-foreground/90">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center bg-background p-6 md:p-12 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                            <img
                                src={logo}
                                alt="BRGY CSM Logo"
                                className="size-10 rounded-md object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                JO Attendance Log
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Attendance Management
                            </p>
                        </div>
                    </div>

                    <Card className="border border-border bg-card shadow-lg">
                        <div className="p-8 md:p-10">
                            <div className="mb-8">
                                <h2 className="mb-2 text-3xl font-bold text-card-foreground">
                                    Welcome back
                                </h2>
                                <p className="text-muted-foreground">
                                    Sign in to your account to continue
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="joidnum">
                                                    JO ID Number
                                                </Label>
                                                <Input
                                                    id="joidnum"
                                                    type="text"
                                                    name="joidnum"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="username"
                                                    placeholder="JO ID Number"
                                                />
                                                <InputError
                                                    message={errors.joidnum}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">
                                                        Password
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href="/forgot-password"
                                                            className="ml-auto text-sm"
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder="Password"
                                                        className="pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword((value) => !value)
                                                        }
                                                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                                        aria-label={
                                                            showPassword
                                                                ? 'Hide password'
                                                                : 'Show password'
                                                        }
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                />
                                                <Label htmlFor="remember">
                                                    Remember me
                                                </Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-4 w-full"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing && <Spinner />}
                                                Log in
                                            </Button>
                                        </div>

                                        {canRegister && (
                                            <div className="text-center text-sm text-muted-foreground">
                                                Don't have an account?{' '}
                                                <TextLink
                                                    href="/register"
                                                    tabIndex={5}
                                                >
                                                    Sign up
                                                </TextLink>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Form>
                        </div>
                    </Card>

                    {/* Security Info */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Your data is encrypted and secure
                    </div>
                </div>
            </div>
        </div>
    );
}
