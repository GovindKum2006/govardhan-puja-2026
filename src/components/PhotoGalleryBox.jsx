import React, { useState, useEffect } from 'react';
import { 
  Images, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Play, 
  Pause, 
  X, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function PhotoGalleryBox({ role, t }) {
  const [photos, setPhotos] = useState(() => StorageService.getPhotos());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('box'); // 'box' (slideshow) or 'grid'
  
  // Add Photo Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhotoData, setNewPhotoData] = useState({
    title: '',
    category: 'उत्सव दर्शन',
    url: '',
    caption: ''
  });

  // Auto-play slideshow effect
  useEffect(() => {
    let timer;
    if (isPlaying && photos.length > 1) {
      timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, photos.length]);

  const activePhoto = photos[currentIndex] || photos[0];

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    if (!newPhotoData.title || !newPhotoData.url) return;
    
    const added = StorageService.addPhoto(newPhotoData);
    setPhotos(StorageService.getPhotos());
    setCurrentIndex(photos.length);
    setIsAddModalOpen(false);
    setNewPhotoData({ title: '', category: 'उत्सव दर्शन', url: '', caption: '' });
  };

  const handleDeletePhoto = (id, e) => {
    e.stopPropagation();
    if (photos.length <= 1) {
      alert('कम से कम एक फोटो बॉक्स में रहना आवश्यक है।');
      return;
    }
    if (window.confirm('क्या आप इस फोटो को बॉक्स से हटाना चाहते हैं?')) {
      StorageService.deletePhoto(id);
      setPhotos(StorageService.getPhotos());
      if (currentIndex >= photos.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewPhotoData(prev => ({
        ...prev,
        url: event.target.result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden p-4 sm:p-6 space-y-5">
      
      {/* Box Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 rounded-xl shadow-sm">
              <Images className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
                <span>श्री गोवर्धन पूजा एवं उत्सव दर्शन बॉक्स</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-sans font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {photos.length} फोटो
                </span>
              </h2>
              <p className="text-xs text-gray-600">
                भगवान श्री कृष्ण, अन्नकूट 56 भोग, पूजा वेदी एवं रमन डिहरा उत्सव की सभी तस्वीरें एक साथ देखें
              </p>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
            <button
              onClick={() => setViewMode('box')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'box' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-amber-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>दर्शन बॉक्स</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'grid' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-amber-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>सभी ग्रिड</span>
            </button>
          </div>

          {/* Admin Add Photo Button */}
          {role === 'admin' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>+ फोटो जोड़ें</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode: Single Interactive Box with Slider & Thumbnails */}
      {viewMode === 'box' && activePhoto && (
        <div className="space-y-4">
          
          {/* Main Stage Frame */}
          <div className="relative group bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/80 aspect-[16/9] sm:aspect-[21/9] max-h-[460px] flex items-center justify-center">
            
            {/* Active Image */}
            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="w-full h-full object-contain sm:object-cover transform transition-transform duration-700 cursor-pointer"
              onClick={() => setLightboxPhoto(activePhoto)}
            />

            {/* Top Bar Overlay */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent p-3 sm:p-4 flex items-center justify-between text-white pointer-events-none">
              <div className="flex items-center space-x-2 pointer-events-auto">
                <span className="bg-amber-500/90 text-amber-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-amber-200/90 font-mono font-bold bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>

              <div className="flex items-center space-x-2 pointer-events-auto">
                {/* Slideshow Play/Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20 transition-all"
                  title={isPlaying ? 'रोकें (Pause)' : 'ऑटो स्लाइडशो चलाएं (Play)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-yellow-300" /> : <Play className="w-4 h-4 text-white" />}
                </button>

                {/* Enlarge / Fullscreen Lightbox */}
                <button
                  onClick={() => setLightboxPhoto(activePhoto)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20 transition-all flex items-center space-x-1"
                  title="क्लिक करके बड़ा देखें (Full Screen)"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs font-bold hidden sm:inline">बड़ा देखें</span>
                </button>
              </div>
            </div>

            {/* Left & Right Arrow Navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-amber-600 text-white border border-white/30 shadow-lg transition-transform transform active:scale-95 group-hover:opacity-100"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-amber-600 text-white border border-white/30 shadow-lg transition-transform transform active:scale-95 group-hover:opacity-100"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Bottom Caption Overlay on the image */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 sm:p-5 text-white">
              <h3 className="text-base sm:text-xl font-bold font-heading text-amber-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{activePhoto.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 mt-1 line-clamp-2 font-hindi">
                {activePhoto.caption}
              </p>
            </div>
          </div>

          {/* All Photos in One Strip (Thumbnails Container) */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-2 px-1">
              <span>सभी फोटो थंबनेल बॉक्स (क्लिक कर सीधे देखें):</span>
              <span className="text-gray-500 font-medium">कुल {photos.length} दर्शन तस्वीरें</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {photos.map((photo, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group aspect-[16/10] bg-stone-900 ${
                      isActive
                        ? 'border-amber-500 shadow-md ring-4 ring-amber-400/50 scale-[1.02]'
                        : 'border-transparent hover:border-amber-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[11px] font-bold text-white truncate w-full">
                        {photo.title}
                      </span>
                    </div>

                    {/* Active Check Marker */}
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 bg-amber-500 text-amber-950 rounded-full p-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}

                    {/* Admin Delete */}
                    {role === 'admin' && photos.length > 1 && (
                      <button
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                        className="absolute top-1.5 left-1.5 p-1 bg-rose-600/90 text-white rounded-md hover:bg-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="फोटो हटाएं"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Grid Mode: See All Photos Side by Side */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="bg-stone-900 rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/60 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                  {photo.category}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-yellow-400 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>बड़ा देखें</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-b from-stone-900 to-amber-950 text-white">
                <h4 className="text-sm font-bold text-amber-200 line-clamp-1 font-heading">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 font-hindi">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none"
          onClick={() => setLightboxPhoto(null)}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between text-white pb-3 border-b border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-300 font-heading">
                {lightboxPhoto.title}
              </h3>
              <p className="text-xs text-gray-400">{lightboxPhoto.category}</p>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={lightboxPhoto.url}
                download={`${lightboxPhoto.title}.png`}
                className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                title="फोटो डाउनलोड करें"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">डाउनलोड</span>
              </a>

              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="बंद करें"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Central Image with aspect preservation */}
          <div 
            className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-amber-400/60"
            />
          </div>

          {/* Caption Box */}
          <div 
            className="bg-black/60 p-3 sm:p-4 rounded-2xl border border-white/10 text-center text-xs sm:text-sm text-gray-200 max-w-3xl mx-auto font-hindi"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxPhoto.caption}
          </div>
        </div>
      )}

      {/* Admin Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                बॉक्स में नई फोटो जोड़ें (Add Photo to Box)
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  फोटो का शीर्षक (Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. गोवर्धन महाआरती दर्शन"
                  value={newPhotoData.title}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">श्रेणी (Category)</label>
                <select
                  value={newPhotoData.category}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                >
                  <option value="भगवान श्री कृष्ण दर्शन">भगवान श्री कृष्ण दर्शन</option>
                  <option value="अन्नकूट महोत्सव">अन्नकूट महोत्सव</option>
                  <option value="भक्त एवं परिवार">भक्त एवं परिवार</option>
                  <option value="सेवादार दल">सेवादार दल</option>
                  <option value="मंदिर सज्जा व रंगोली">मंदिर सज्जा व रंगोली</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  कंप्यूटर या फोन से फोटो अपलोड करें
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  या फोटो का वेब लिंक (Image URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. /assets/krishna-govardhan.png या https://..."
                  value={newPhotoData.url}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  विवरण / कैप्शन (Caption)
                </label>
                <textarea
                  rows="2"
                  placeholder="फोटो का संक्षिप्त विवरण..."
                  value={newPhotoData.caption}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, caption: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-hindi"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  + बॉक्स में जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
