import { Photographer } from './types';

export const INITIAL_PHOTOGRAPHERS: Photographer[] = [
  {
    id: 'dika-photography',
    username: 'dikawijaya',
    password: 'dika123',
    name: 'Dika Wijaya',
    bio: 'Fotografer spesialis pernikahan (wedding/engagement) dengan pendekatan dokumenter & sinematik. Sentuhan emosi tulus dalam setiap bingkai yang abadi.',
    specialtyTags: ['Wedding', 'Engagement', 'Prewedding', 'Intimate Session'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    whatsapp: '6281234567890',
    instagram: 'dikawijaya.photo',
    email: 'dika@photofolio.pro',
    themeColor: '#C5A059', // Classic Gold
    layoutStyle: 'Classic Album',
    albums: [
      {
        id: 'wedding-1',
        name: 'The Royal Wedding of Andi & Susi',
        description: 'Pernikahan mewah adat Sunda dan Resepsi Modern di Plataran Cilandak, Jakarta.',
        category: 'Wedding',
        coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        photos: [
          {
            id: 'wedding-1-p1',
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
            caption: 'Proses Akad Nikah yang khidmat dan diselimuti haru keluarga terdekat.',
            date: '2026-04-12'
          },
          {
            id: 'wedding-1-p2',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
            caption: 'Detail dekorasi pelaminan dengan perpaduan bunga mawar putih dan lilin hangat.',
            date: '2026-04-12'
          },
          {
            id: 'wedding-1-p3',
            url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80',
            caption: 'Cincin kawin emas putih milik Andi & Susi di atas buket bunga lily.',
            date: '2026-04-12'
          },
          {
            id: 'wedding-1-p4',
            url: 'https://images.unsplash.com/photo-1520854221256-13d71cc996ba?w=800&auto=format&fit=crop&q=80',
            caption: 'Tawa bahagia pasangan pengantin saat pelepasan kembang api di malam resepsi.',
            date: '2026-04-12'
          }
        ]
      },
      {
        id: 'wedding-2',
        name: 'Sunset Vows - Rama & Shinta',
        description: 'Sesi Pre-wedding intim bertemakan golden hour di Pantai Melasti, Bali.',
        category: 'Engagement',
        coverUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
        photos: [
          {
            id: 'wedding-2-p1',
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
            caption: 'Tatapan cinta Rama & Shinta di sela sela deburan ombak laut selatan.',
            date: '2026-03-05'
          },
          {
            id: 'wedding-2-p2',
            url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format&fit=crop&q=80',
            caption: 'Siluet estetik memeluk hangat dibalut cahaya matahari senja.',
            date: '2026-03-05'
          }
        ]
      }
    ],
    bookings: [
      {
        id: 'book-1',
        clientName: 'Reza Pahlevi',
        email: 'reza@gmail.com',
        phone: '081299887766',
        eventType: 'Wedding Party',
        eventDate: '2026-08-15',
        message: 'Halo Mas Dika, saya tertarik dengan paket Royal Wedding untuk dipasang di event Bandung bulan Agustus nanti.',
        status: 'New',
        createdAt: '2026-05-18T10:00:00Z'
      }
    ]
  },
  {
    id: 'giri-visuals',
    username: 'giripratama',
    password: 'giri123',
    name: 'Giri Pratama',
    bio: 'Spesialis fotografi komersial, produk katalog, dan industri kreatif. Membantu meningkatkan nilai brand Anda lewat visual minimalis nan menawan.',
    specialtyTags: ['Product', 'Food & Beverage', 'E-Commerce', 'Brand Campaigns'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    whatsapp: '6289988776655',
    instagram: 'giri.visuals',
    email: 'giri@photofolio.pro',
    themeColor: '#5984C5', // Modern Blue
    layoutStyle: 'Interactive Cards',
    albums: [
      {
        id: 'prod-1',
        name: 'Sore Coffee House Catalog',
        description: 'Kreasi minuman kopi, manual brew, dan ambient interior kafe berkonsep kayu hangat.',
        category: 'Product',
        coverUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&auto=format&fit=crop&q=80',
        photos: [
          {
            id: 'prod-1-p1',
            url: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&auto=format&fit=crop&q=80',
            caption: 'Metode manual brew V60 dengan detail rintik air menyentuh biji kopi arabika.',
            date: '2026-02-14'
          },
          {
            id: 'prod-1-p2',
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            caption: 'Katalog jam tangan kayu organik lokal untuk peluncuran merchandise Sore Coffee.',
            date: '2026-02-14'
          }
        ]
      },
      {
        id: 'prod-2',
        name: 'Lumina Perfumery Studio',
        description: 'Sesi still life minimalis menggunakan pencahayaan natural terik siang hari.',
        category: 'Product',
        coverUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
        photos: [
          {
            id: 'prod-2-p1',
            url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
            caption: 'Lumina Lavender mist berbaur bayangan dedaunan hijau di atas alas marmer.',
            date: '2026-05-01'
          },
          {
            id: 'prod-2-p2',
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
            caption: 'Vibrant pop red accent - Sepatu kets lari edisi khusus untuk kampanye media sosial.',
            date: '2026-05-02'
          }
        ]
      }
    ],
    bookings: [
      {
        id: 'book-2',
        clientName: 'Sore Group',
        email: 'info@sorecoffee.com',
        phone: '085333112244',
        eventType: 'Product Photography',
        eventDate: '2026-06-10',
        message: 'Kami ingin menjadwalkan ulang sesi foto menu es kopi susu kelapa terbaru kami.',
        status: 'New',
        createdAt: '2026-05-20T08:30:00Z'
      }
    ]
  },
  {
    id: 'widya-moments',
    username: 'widyalestari',
    password: 'widya123',
    name: 'Widya Lestari',
    bio: 'Menangkap kegembiraan sejati dalam setiap pencapaian hidup Anda. Wisuda, pesta ulang tahun, dan perayaan keluarga dengan gaya ceria & bercahaya.',
    specialtyTags: ['Graduation', 'Birthday Parties', 'Family Portraits', 'Baby Milestones'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    whatsapp: '6285711223344',
    instagram: 'widyalestari.moments',
    email: 'widya@photofolio.pro',
    themeColor: '#C55959', // Warm Red / Sunset Coral
    layoutStyle: 'Masonry Grid',
    albums: [
      {
        id: 'grad-1',
        name: 'UI Graduate Pride - Amelia',
        description: 'Sesi wisuda penuh kebanggaan dan haru Amelia di area Balairung Universitas Indonesia.',
        category: 'Graduation',
        coverUrl: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae0d76?w=800&auto=format&fit=crop&q=80',
        photos: [
          {
            id: 'grad-1-p1',
            url: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae0d76?w=800&auto=format&fit=crop&q=80',
            caption: 'Senyum bangga Amelia memegang tabung ijazah kelulusan berlatar pepohonan rindang.',
            date: '2026-02-28'
          },
          {
            id: 'grad-1-p2',
            url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
            caption: 'Momen klasik pelepasan topi toga bersama rekan sejawat satu angkatan.',
            date: '2026-02-28'
          }
        ]
      },
      {
        id: 'birth-1',
        name: 'Sweet Seventeen - Chloe Glow',
        description: 'Pesta ulang tahun ke-17 meriah berkonsep neon light di Ballroom Hotel Mercure.',
        category: 'Birthday',
        coverUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
        photos: [
          {
            id: 'birth-1-p1',
            url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
            caption: 'Tumpukan balon ungu pastel dengan lilin angka 17 berkilau keemasan.',
            date: '2026-01-18'
          },
          {
            id: 'birth-1-p2',
            url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
            caption: 'Sesaat sebelum tiup lilin kue susun cokelat stroberi kesukaan Chloe.',
            date: '2026-01-18'
          }
        ]
      }
    ],
    bookings: [
      {
        id: 'book-3',
        clientName: 'Siti Rahma',
        email: 'sitirahma@ui.ac.id',
        phone: '081244332211',
        eventType: 'Graduation Day',
        eventDate: '2026-09-08',
        message: 'Mbak Widya, mohon info kuota untuk foto wisuda di tanggal 8 September. Saya berdua bersama sahabat saya.',
        status: 'New',
        createdAt: '2026-05-19T14:20:00Z'
      }
    ]
  }
];
