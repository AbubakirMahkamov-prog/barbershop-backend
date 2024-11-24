export async function isPhoneNumberValidator(phone: string): Promise<boolean> {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}