export interface Organization {
  id: string;
  name: string;
  code: string;
  employeesCount: number;
}

export interface Campaign {
  id: string;
  year: number;
  name: string;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  organizations: string[];
}

export interface Employee {
  id: string;
  tabNumber: string;
  fullName: string;
  position: string;
  department: string;
  organizationId: string;
  positions: PositionAssignment[];
}

export interface PositionAssignment {
  position: string;
  department: string;
  organizationId: string;
}

export interface VacationPeriod {
  id: string;
  employeeId: string;
  campaignId: string;
  startDate: string;
  endDate: string;
  days: number;
  type: 'annual' | 'additional' | 'unpaid';
  status: 'planned' | 'approved' | 'cancelled';
  notes: string;
}

export interface Holiday {
  date: string;
  name: string;
}
