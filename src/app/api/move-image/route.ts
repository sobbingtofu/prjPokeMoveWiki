import {NextRequest, NextResponse} from "next/server";
import * as cheerio from "cheerio";

export interface responseDataType {
  result: "success" | "error";
  data: string;
}

export type FinalDataType = Promise<NextResponse<responseDataType>>;

async function findImageFromUrl(url: string, moveName: string) {
  console.log("Fetching URL:", url);

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const allImages = $("img");
  console.log("Total images found:", allImages.length);

  // 1. alt 속성에 moveName을 포함하는 이미지들 필터링
  const candidateImages: Array<{src: string; alt: string; index: number}> = [];

  allImages.each((i, elem) => {
    const alt = $(elem).attr("alt");
    const src = $(elem).attr("src");

    if (alt && typeof alt === "string" && alt.includes(moveName) && src) {
      candidateImages.push({src, alt, index: i});
      console.log(`Candidate image found at index ${i}:`, {src, alt});
    }
  });

  if (candidateImages.length === 0) {
    return null;
  }

  // 2. .webp 확장자를 가진 이미지들 필터링
  const webpImages = candidateImages.filter((img) => img.src.endsWith(".webp"));

  // 3. 최종 타깃 이미지 선택
  const targetImage = webpImages.length > 0 ? webpImages[0] : candidateImages[0];

  console.log("Target image selected:", targetImage);

  // src가 상대 경로인 경우 절대 경로로 변환
  let imageUrl = targetImage.src;
  if (imageUrl.startsWith("//")) {
    imageUrl = "https:" + imageUrl;
  } else if (imageUrl.startsWith("/")) {
    imageUrl = "https://namu.wiki" + imageUrl;
  }

  return imageUrl;
}

export async function GET(request: NextRequest): FinalDataType {
  const searchParams = request.nextUrl.searchParams;
  const moveName = searchParams.get("moveName");

  if (!moveName) {
    return NextResponse.json({result: "error", data: "Move name is required"}, {status: 400});
  }

  try {
    // 첫 번째 시도: "(포켓몬스터)" 포함
    const url1 = `https://namu.wiki/w/${encodeURIComponent(moveName + "(포켓몬스터)")}`;
    let imageUrl = await findImageFromUrl(url1, moveName);

    // 두 번째 시도: "(포켓몬스터)" 없이
    if (!imageUrl) {
      console.log("No image found in first URL, trying alternative URL");
      const url2 = `https://namu.wiki/w/${encodeURIComponent(moveName)}`;
      imageUrl = await findImageFromUrl(url2, moveName);
    }

    if (imageUrl === null) {
      return NextResponse.json({result: "error", data: "No matching image found"}, {status: 200});
    }

    return NextResponse.json({result: "success", data: imageUrl}, {status: 200});
  } catch (error) {
    console.error("Error fetching move image:", error);
    return NextResponse.json({result: "error", data: "Failed to fetch image"}, {status: 500});
  }
}
