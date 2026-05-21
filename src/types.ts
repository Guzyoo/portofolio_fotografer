export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  category: 'Wedding' | 'Engagement' | 'Birthday' | 'Graduation' | 'Product' | 'Other';
  coverUrl: string;
  photos: Photo[];
}

export interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  status: 'New' | 'Replied' | 'Completed';
  createdAt: string;
}

export interface Photographer {
  id: string;
  username: string; // Used in URL-like switching
  password?: string;
  name: string;
  bio: string;
  specialtyTags: string[];
  avatarUrl: string;
  whatsapp: string;
  instagram: string;
  email: string;
  themeColor: string; // Hex color code
  layoutStyle: 'Classic Album' | 'Interactive Cards' | 'Masonry Grid';
  albums: Album[];
  bookings: Booking[];
}
