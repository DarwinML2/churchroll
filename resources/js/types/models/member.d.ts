import { type Option } from '@/components/custom-ui/MultiSelect';
import { type CivilStatus, type Gender } from '@/enums';
import { type AddressRelationship } from '@/types/models/address';
import { type TagRelationship } from '@/types/models/tag';

export type MemberMorphClass = 'member';
export interface Member {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  civilStatus: CivilStatus;
  skills: TagRelationship[];
  skillsCount?: number;
  categories: TagRelationship[];
  categoriesCount?: number;
  address?: AddressRelationship | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type MemberFormData = {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  civil_status: string;
  skills: Option[];
  categories: Option[];
};
