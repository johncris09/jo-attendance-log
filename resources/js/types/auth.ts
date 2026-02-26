export type User = {
    id: number | string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    joidnum?: string;
    JOIDNUM?: string;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
