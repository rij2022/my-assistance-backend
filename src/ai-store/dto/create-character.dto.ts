export class CreateCharacterDto {
    name: string;
    background: string;
    lottieUrl: string;
    price: number;
    description: string;
    moodTags: string[];
    voice?: string;
}
