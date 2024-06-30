export type Answer = {
    question: string;
    answer: string;
}

export type Product = {
    title: string;
    // description: string;
    image: string;
    price: number;
    url: string;
}

export type Question = {
    question: string;
    options: string[];
} 