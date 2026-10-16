// Prefisso per GitHub Pages (sito servito da /group-project). In locale è vuoto.
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
