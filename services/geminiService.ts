import { GoogleGenAI, Type, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: { type: Type.STRING, description: 'Nama resep masakan yang menarik dan spesifik.' },
      description: { type: Type.STRING, description: 'Deskripsi singkat dan menggugah selera tentang resep ini.' },
      cookTime: { type: Type.STRING, description: 'Estimasi waktu memasak, contoh: "15 menit".' },
      difficulty: {
        type: Type.STRING,
        enum: ['Mudah', 'Sedang', 'Sulit'],
        description: 'Tingkat kesulitan resep.'
      },
      ingredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Daftar bahan yang dibutuhkan.'
      },
      instructions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Langkah-langkah memasak secara berurutan.'
      },
      imageKeywords: { type: Type.STRING, description: 'Satu frasa pencarian gambar singkat dalam Bahasa Inggris (maksimal 3 kata) yang sangat mungkin menghasilkan gambar makanan yang relevan dan lezat di situs stok foto. Contoh: "Indonesian fried rice", "Spicy chicken satay".' }
    },
    required: ['recipeName', 'description', 'cookTime', 'difficulty', 'ingredients', 'instructions', 'imageKeywords']
  }
};

export const generateRecipes = async (ingredients: string[]) => {
  const prompt = `
    Anda adalah seorang chef ahli dan food stylist dengan spesialisasi mengubah bahan sisa menjadi hidangan istimewa yang terlihat lezat.
    Tolong berikan TEPAT 3 (TIGA) variasi resep masakan yang berbeda, terlihat, dan terdengar sangat lezat menggunakan bahan-bahan utama berikut: ${ingredients.join(', ')}.
    Fokus untuk membuat resep yang benar-benar menggugah selera dan praktis. Pastikan nama resepnya unik dan menarik.
    Untuk setiap resep, berikan 'imageKeywords' yang terdiri dari satu frasa pencarian singkat (maksimal 3 kata) DALAM BAHASA INGGRIS. Kata kunci ini harus sangat spesifik dan relevan agar bisa menemukan gambar yang terlihat profesional dan lezat di situs stok foto. Contoh: "Indonesian fried rice", "chicken satay grilled", "beef rendang close up".
    Fokus pada penggunaan bahan yang diberikan, tetapi Anda bisa menambahkan bahan-bahan dasar yang umum ada di dapur (seperti garam, merica, minyak, bawang putih, kecap) jika diperlukan untuk membuat hidangan yang lengkap dan lezat.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. The model might be overloaded. Please try again later.");
  }
};

export const askChefAI = async (question: string): Promise<string> => {
  const prompt = `
    Anda adalah ChefAI, seorang pakar kuliner virtual yang ramah, membantu, dan sangat berpengetahuan.
    Misi Anda adalah membantu pengguna dengan segala hal yang berkaitan dengan dunia masak-memasak.
    Jawab pertanyaan pengguna berikut dengan jelas, terstruktur, dan mudah dipahami.
    Jika perlu, gunakan format markdown untuk daftar (misalnya '* item satu') atau untuk menekankan poin penting (misalnya '**teks tebal**').
    Selalu pertahankan persona yang positif dan mendorong.

    Pertanyaan Pengguna: "${question}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
    });
    return response.text;
  } catch (error) {
      console.error("Error asking Chef AI:", error);
      throw new Error("Gagal mendapatkan jawaban dari Chef AI. Coba lagi beberapa saat.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
  const fullPrompt = `A delicious, professional, photorealistic food photograph of: ${prompt}. Centered, high resolution, vibrant colors, appetizing.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response?.candidates?.[0]?.content?.parts?.[0];

    if (part?.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    
    console.warn('No image data found in Gemini response, falling back to Unsplash.');
    return `https://source.unsplash.com/400x250/?${encodeURIComponent(prompt)}`;

  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    return `https://source.unsplash.com/400x250/?${encodeURIComponent(prompt)}`;
  }
};