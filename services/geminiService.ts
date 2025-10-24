import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import type { Recipe } from '../types';

// Mengambil Kunci API dari environment variables yang disediakan oleh platform hosting (seperti Vercel).
// Pastikan Anda telah mengatur environment variable dengan nama 'API_KEY'.
const API_KEY = process.env.API_KEY;

// Cek apakah API_KEY sudah tersedia. Jika tidak, fungsionalitas AI tidak akan berjalan.
if (!API_KEY) {
  console.error("Kunci API Gemini tidak ditemukan. Harap pastikan environment variable 'API_KEY' sudah diatur di Vercel atau platform hosting Anda.");
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

// Helper function to decode base64 and create a Blob
function base64ToBlob(base64: string, contentType: string = 'image/jpeg'): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

const generateAndStoreImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    console.warn('API Key is not set, falling back to Unsplash for image storage.');
    return `https://source.unsplash.com/400x250/?${encodeURIComponent(prompt)}`;
  }

  const fullPrompt = `A delicious, professional, photorealistic food photograph of: ${prompt}. Centered, high resolution, vibrant colors, appetizing, studio lighting.`;
  
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '4:3',
    },
  });

  const image = response.generatedImages?.[0]?.image;

  if (image?.imageBytes) {
    const base64ImageBytes: string = image.imageBytes;
    const imageBlob = base64ToBlob(base64ImageBytes, 'image/jpeg');
    const fileName = `${uuidv4()}.jpeg`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, imageBlob);

    if (error) {
      console.error('Error uploading image to Supabase:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }
  
  throw new Error('No image data found in Gemini response.');
};


export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  if (!API_KEY) {
      throw new Error("Kunci API Gemini belum dikonfigurasi. Pastikan environment variable 'API_KEY' sudah diatur.");
  }
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
    const recipes: Recipe[] = JSON.parse(jsonText);

    const recipesWithImages = await Promise.all(recipes.map(async (recipe) => {
      try {
        const imageUrl = await generateAndStoreImage(recipe.imageKeywords);
        return { ...recipe, imageUrl };
      } catch (imageError) {
        console.error(`Gagal membuat gambar untuk "${recipe.recipeName}". Menggunakan gambar pengganti.`, imageError);
        return { ...recipe, imageUrl: `https://source.unsplash.com/400x250/?${encodeURIComponent(recipe.imageKeywords)}` };
      }
    }));

    return recipesWithImages;
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. The model might be overloaded. Please try again later.");
  }
};

export const askChefAI = async (question: string): Promise<string> => {
  if (!API_KEY) {
      return "Maaf, Kunci API Gemini belum dikonfigurasi. Saya tidak dapat menjawab pertanyaan Anda saat ini.";
  }
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