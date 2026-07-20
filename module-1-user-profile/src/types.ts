export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'O+'
  | 'O-'
  | 'AB+'
  | 'AB-';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface MedicalProfile {
  bloodGroup: BloodGroup;
  allergies: string[];
  conditions: string[];
  medications: string[];
}

export interface User {
  fullName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  medical: MedicalProfile;
  contacts: EmergencyContact[];
}

export const BLOOD_GROUPS: BloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
];

export const dummyUser: User = {
  fullName: 'Sarah Mitchell',
  email: 'sarah.mitchell@example.com',
  phone: '+1 (555) 248-9173',
  photoUrl: 'https://images.pexels.com/photos/5998448/pexels-photo-5998448.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  medical: {
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Peanuts', 'Latex'],
    conditions: ['Type 1 Diabetes', 'Asthma'],
    medications: ['Insulin (Lantus)', 'Albuterol Inhaler', 'Metformin'],
  },
  contacts: [
    { id: 'c1', name: 'James Mitchell (Husband)', phone: '+1 (555) 882-1043' },
    { id: 'c2', name: 'Dr. Emily Carter (Physician)', phone: '+1 (555) 771-2298' },
    { id: 'c3', name: 'Linda Mitchell (Mother)', phone: '+1 (555) 334-6612' },
  ],
};
