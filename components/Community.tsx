
import React from 'react';
import { CameraIcon, StarIcon, UserCircleIcon } from './icons/Icons';

const UserRecipeCard: React.FC<{ name: string; author: string; rating: number; imageUrl: string; description: string }> = ({ name, author, rating, imageUrl, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
    <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h4 className="text-xl font-bold font-display text-brand-green-dark dark:text-brand-green-light">{name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">oleh {author}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    </div>
  </div>
);

export const Community: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-display text-brand-green-dark dark:text-brand-green-light">
          Kreasi Komunitas
        </h2>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          Bagikan resep andalanmu dan temukan inspirasi dari pejuang #ZeroWaste lainnya!
        </p>
      </div>

      <div className="bg-brand-green-light dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg mb-12">
        <h3 className="text-2xl font-bold mb-4">Bagikan Resepmu!</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nama Resep" className="p-3 rounded-lg dark:bg-gray-700 border dark:border-gray-600" />
          <input type="text" placeholder="Bahan-bahan sisa utama" className="p-3 rounded-lg dark:bg-gray-700 border dark:border-gray-600" />
        </div>
        <textarea placeholder="Langkah-langkah..." rows={4} className="w-full mt-4 p-3 rounded-lg dark:bg-gray-700 border dark:border-gray-600"></textarea>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50">
                <CameraIcon className="w-6 h-6" />
                <span>Unggah Foto</span>
            </button>
            <button className="w-full sm:w-auto bg-brand-green-dark text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-green-dark/90 transition-colors">
                Kirim Resep
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UserRecipeCard 
          name="Nasi Goreng 'Pembersih Kulkas'"
          author="Budi Setiawan"
          rating={5}
          imageUrl="https://picsum.photos/400/300?random=10"
          description="Solusi kilat saat lapar malam hari. Pakai sayur apa aja yang ada!"
        />
        <UserRecipeCard 
          name="Setup Roti Tawar Jadul"
          author="Citra Lestari"
          rating={4}
          imageUrl="https://picsum.photos/400/300?random=11"
          description="Roti tawar pinggiran jangan dibuang! Bisa jadi dessert enak."
        />
        <UserRecipeCard 
          name="Tumis Kulit Ayam Crispy"
          author="Andi Wijaya"
          rating={5}
          imageUrl="https://picsum.photos/400/300?random=12"
          description="Kulit ayam sisa jangan dibuang, bisa jadi lauk atau camilan gurih."
        />
      </div>
    </div>
  );
};
