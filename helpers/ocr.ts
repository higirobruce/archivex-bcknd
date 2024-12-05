import * as penteract from "npm:penteract";

export async function performOCR(imagePath: string) {
  try {
    const result = await penteract.recognize(imagePath);
    console.log("Extracted Text:");
    console.log(result.text); // Display extracted text
  } catch (error) {
    console.error("Error performing OCR:", error);
  }
}
