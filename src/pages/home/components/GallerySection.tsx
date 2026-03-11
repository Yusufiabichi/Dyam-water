
import { useEffect, useRef, useState } from 'react';

const galleryImages = [
  {
    id: 1,
    src: "./charity-children.png",
    caption: "Community Water Distribution"
  },
  {
    id: 2,
    src: "./dispenser.jpg",
    caption: "Corporate Water Dispenser"
  },
  {
    id: 3,
    src: "./75cl.jpg",
    caption: "Pure Natural Water"
  },
  {
    id: 4,
    src: "./ramadan-pic.png",
    caption: "Ramadan Iftar Support"
  },
  // {
  //   id: 5,
  //   src: "https://readdy.ai/api/search-image?query=Delivery%20truck%20with%20bottled%20water%20products%2C%20Nigerian%20distribution%20network%2C%20logistics%20and%20supply%20chain%2C%20branded%20vehicle%2C%20urban%20street%20scene%2C%20professional%20business%20photography%2C%20commercial%20fleet&width=600&height=400&seq=gallery-005&orientation=landscape",
  //   caption: "Nationwide Distribution Network"
  // },
  {
    id: 6,
    src: "https://readdy.ai/api/search-image?query=Nigerian%20orphanage%20children%20drinking%20clean%20bottled%20water%2C%20happy%20smiling%20faces%2C%20caring%20environment%2C%20bright%20daylight%2C%20charitable%20support%2C%20heartwarming%20moment%2C%20documentary%20photography%20style&width=600&height=400&seq=gallery-006&orientation=landscape",
    caption: "Supporting Orphanages"
  },
  // {
  //   id: 7,
  //   src: "https://readdy.ai/api/search-image?query=Premium%20bottled%20water%20products%20arranged%20beautifully%2C%20different%20sizes%20of%20water%20bottles%2C%20product%20display%2C%20clean%20white%20background%2C%20commercial%20product%20photography%2C%20brand%20showcase%2C%20professional%20lighting&width=600&height=400&seq=gallery-007&orientation=landscape",
  //   caption: "Our Product Range"
  // },
  {
    id: 8,
    src: "https://readdy.ai/api/search-image?query=Nigerian%20hospital%20staff%20receiving%20donated%20bottled%20water%2C%20healthcare%20workers%20grateful%2C%20medical%20facility%20background%2C%20charitable%20donation%20moment%2C%20documentary%20photography%2C%20professional%20healthcare%20environment&width=600&height=400&seq=gallery-008&orientation=landscape",
    caption: "Healthcare Support Initiative"
  }
];

const GallerySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset scroll when reaching halfway (since we duplicated the images)
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...galleryImages, ...galleryImages];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <span className="text-sm font-medium text-brand-500 tracking-wider uppercase">
            / Our Gallery
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl mt-4 mb-6">
            <span className="text-gray-900">Moments That </span>
            <span className="text-brand-500 italic">Matter</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From our production facility to community outreach, see how DYAM is making a difference one bottle at a time.
          </p>
        </div>
      </div>

      {/* Auto-scrolling Gallery */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden py-4"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedImages.map((image, index) => (
            <div 
              key={`${image.id}-${index}`}
              className="flex-shrink-0 w-80 lg:w-96 group cursor-pointer"
            >
              <div className="relative h-56 lg:h-64 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-medium text-lg">{image.caption}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pause Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <i className={`${isPaused ? 'ri-play-circle-line' : 'ri-pause-circle-line'} text-lg`}></i>
          <span>{isPaused ? 'Hover to pause' : 'Auto-scrolling'}</span>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
