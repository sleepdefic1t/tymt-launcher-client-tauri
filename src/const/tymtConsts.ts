export interface IConstTymtLinks {
  documentation: string;
  policy: string;
  twitter: string;
  discord: string;
  solarcard: string;
  youtube: string;
  telegram: string;
  medium: string;
  instagram: string;
  facebook: string;
  website: string;
}

export async function getConstTymtLinks(): Promise<IConstTymtLinks | null> {
  try {
    const response = await fetch("/CONST_TYMT_LINKS.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch CONST_TYMT_LINKS: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching CONST_TYMT_LINKS:", error);
    return null;
  }
}
