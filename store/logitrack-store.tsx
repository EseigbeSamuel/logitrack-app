import React, { createContext, useContext, useState, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type ShipmentStatus = 'pending' | 'picked_up' | 'in_transit' | 'delivered';
export type PackageCategory = 'Documents' | 'Electronics' | 'Food/Perishables' | 'General';

export interface StatusLog {
  timestamp: string;
  status: ShipmentStatus | 'created' | 'assigned' | 'delay_reported' | 'delay_cleared';
  note: string;
}

export interface Shipment {
  id: string; // Tracking number, e.g., 'LT-4567'
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  status: ShipmentStatus;
  packageCategory: PackageCategory;
  weight: number;
  price: number;
  notes?: string;
  driverId: string | null;
  driverName: string | null;
  delayReason: string | null;
  statusLogs: StatusLog[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface RiderStats {
  isOnline: boolean;
  earnings: number;
  completedTasks: number;
  hoursOnline: number;
}

interface LogiTrackContextType {
  activeRole: 'customer' | 'rider';
  shipments: Shipment[];
  riderStats: RiderStats;
  switchRole: (role: 'customer' | 'rider') => void;
  createShipment: (data: {
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    packageCategory: PackageCategory;
    weight: number;
    notes?: string;
  }) => string;
  acceptTask: (id: string) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus, note: string) => void;
  reportDelay: (id: string, reason: string) => void;
  clearDelay: (id: string) => void;
  toggleOnline: () => void;
  resetStore: () => void;
}

const LogiTrackContext = createContext<LogiTrackContextType | undefined>(undefined);

// Helper for haptics
const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
  if (Platform.OS !== 'web') {
    try {
      if (type === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (e) {
      // Ignore errors if haptics is not available
    }
  }
};

const DEFAULT_SHIPMENTS: Shipment[] = [
  {
    id: 'LT-8910',
    senderName: 'Apex Electronics',
    senderAddress: '100 Industrial Pkwy, Sector 4',
    recipientName: 'Sarah Jenkins',
    recipientAddress: '742 Evergreen Terrace, Springfield',
    status: 'delivered',
    packageCategory: 'Electronics',
    weight: 4.8,
    price: 12.20,
    notes: 'Fragile: handle with care. Signature required.',
    driverId: 'DRV-101',
    driverName: 'Marcus Vance',
    delayReason: null,
    createdAt: '2026-06-09T09:00:00Z',
    estimatedDelivery: '2026-06-09T14:30:00Z',
    statusLogs: [
      { timestamp: '2026-06-09T09:00:00Z', status: 'created', note: 'Shipment registered in portal.' },
      { timestamp: '2026-06-09T10:15:00Z', status: 'picked_up', note: 'Package loaded at center.' },
      { timestamp: '2026-06-09T11:45:00Z', status: 'in_transit', note: 'Out for final delivery leg.' },
      { timestamp: '2026-06-09T14:22:00Z', status: 'delivered', note: 'Delivered to recipient side-door.' },
    ],
  },
  {
    id: 'LT-4567',
    senderName: 'Lexington Medical Labs',
    senderAddress: '400 Clinic Drive, Building B',
    recipientName: 'Dr. Robert Chen',
    recipientAddress: 'Saint Jude Hospital, Room 304',
    status: 'in_transit',
    packageCategory: 'Documents',
    weight: 0.5,
    price: 8.75,
    notes: 'Urgent medical reports. Do not bend.',
    driverId: 'DRV-101',
    driverName: 'Marcus Vance',
    delayReason: null,
    createdAt: '2026-06-10T08:00:00Z',
    estimatedDelivery: '2026-06-10T13:00:00Z',
    statusLogs: [
      { timestamp: '2026-06-10T08:00:00Z', status: 'created', note: 'Medical courier requested.' },
      { timestamp: '2026-06-10T08:30:00Z', status: 'picked_up', note: 'Sample picked up from laboratory.' },
      { timestamp: '2026-06-10T09:15:00Z', status: 'in_transit', note: 'En route via Expressway.' },
    ],
  },
  {
    id: 'LT-1029',
    senderName: 'Bakehouse Artisans',
    senderAddress: '88 Flour Mill Lane',
    recipientName: 'Amanda Brooks',
    recipientAddress: '12 Bluebird Apt, Floor 3',
    status: 'picked_up',
    packageCategory: 'Food/Perishables',
    weight: 2.2,
    price: 15.30,
    notes: 'Keep upright. High temperature sensitive.',
    driverId: 'DRV-101',
    driverName: 'Marcus Vance',
    delayReason: 'Heavy Traffic',
    createdAt: '2026-06-10T10:30:00Z',
    estimatedDelivery: '2026-06-10T12:45:00Z',
    statusLogs: [
      { timestamp: '2026-06-10T10:30:00Z', status: 'created', note: 'Bakery delivery scheduled.' },
      { timestamp: '2026-06-10T11:00:00Z', status: 'picked_up', note: 'Catering crates loaded.' },
      { timestamp: '2026-06-10T11:20:00Z', status: 'delay_reported', note: 'Heavy traffic congestion reported on Main St Bridge.' },
    ],
  },
  {
    id: 'LT-3841',
    senderName: 'David Kojo',
    senderAddress: '333 West End Blvd',
    recipientName: 'Clara Oswald',
    recipientAddress: '55 Baker Street, flat 4B',
    status: 'pending',
    packageCategory: 'General',
    weight: 6.0,
    price: 14.00,
    notes: 'Leaving package at lobby is fine.',
    driverId: null,
    driverName: null,
    delayReason: null,
    createdAt: '2026-06-10T12:00:00Z',
    estimatedDelivery: '2026-06-10T17:00:00Z',
    statusLogs: [
      { timestamp: '2026-06-10T12:00:00Z', status: 'created', note: 'Booking order registered, awaiting rider dispatch.' },
    ],
  },
];

const DEFAULT_RIDER_STATS: RiderStats = {
  isOnline: true,
  earnings: 235.40,
  completedTasks: 18,
  hoursOnline: 6.8,
};

export function LogiTrackProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<'customer' | 'rider'>('customer');
  const [shipments, setShipments] = useState<Shipment[]>(DEFAULT_SHIPMENTS);
  const [riderStats, setRiderStats] = useState<RiderStats>(DEFAULT_RIDER_STATS);

  const switchRole = (role: 'customer' | 'rider') => {
    setActiveRole(role);
    triggerHaptic('medium');
  };

  const createShipment = (data: {
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    packageCategory: PackageCategory;
    weight: number;
    notes?: string;
  }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `LT-${randomNum}`;
    
    // Pricing rule: Base $5.00 + $1.50 per kg
    const price = parseFloat((5.00 + data.weight * 1.50).toFixed(2));
    
    const nowStr = new Date().toISOString();
    const estTimeStr = new Date(Date.now() + 3 * 3600 * 1000).toISOString(); // 3 hours later
    
    const newShipment: Shipment = {
      id,
      senderName: data.senderName,
      senderAddress: data.senderAddress,
      recipientName: data.recipientName,
      recipientAddress: data.recipientAddress,
      status: 'pending',
      packageCategory: data.packageCategory,
      weight: data.weight,
      price,
      notes: data.notes,
      driverId: null,
      driverName: null,
      delayReason: null,
      createdAt: nowStr,
      estimatedDelivery: estTimeStr,
      statusLogs: [
        { timestamp: nowStr, status: 'created', note: 'Shipment created and registered.' }
      ],
    };

    setShipments((prev) => [newShipment, ...prev]);
    triggerHaptic('success');
    return id;
  };

  const acceptTask = (id: string) => {
    const nowStr = new Date().toISOString();
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            driverId: 'DRV-101',
            driverName: 'Marcus Vance',
            statusLogs: [
              ...s.statusLogs,
              { timestamp: nowStr, status: 'assigned', note: 'Task accepted by rider Marcus Vance.' },
            ],
          };
        }
        return s;
      })
    );
    triggerHaptic('success');
  };

  const updateShipmentStatus = (id: string, status: ShipmentStatus, note: string) => {
    const nowStr = new Date().toISOString();
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          // If status changes to delivered, reward earnings to driver
          if (status === 'delivered' && s.status !== 'delivered') {
            setRiderStats((stats) => ({
              ...stats,
              completedTasks: stats.completedTasks + 1,
              earnings: parseFloat((stats.earnings + s.price * 0.75).toFixed(2)), // 75% cut for rider
            }));
            triggerHaptic('success');
          } else {
            triggerHaptic('light');
          }

          return {
            ...s,
            status,
            statusLogs: [
              ...s.statusLogs,
              { timestamp: nowStr, status, note: note || `Shipment status updated to ${status}.` },
            ],
          };
        }
        return s;
      })
    );
  };

  const reportDelay = (id: string, reason: string) => {
    const nowStr = new Date().toISOString();
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            delayReason: reason,
            statusLogs: [
              ...s.statusLogs,
              { timestamp: nowStr, status: 'delay_reported', note: `Delay reported: ${reason}` },
            ],
          };
        }
        return s;
      })
    );
    triggerHaptic('warning');
  };

  const clearDelay = (id: string) => {
    const nowStr = new Date().toISOString();
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            delayReason: null,
            statusLogs: [
              ...s.statusLogs,
              { timestamp: nowStr, status: 'delay_cleared', note: 'Delay cleared. Logistics resume.' },
            ],
          };
        }
        return s;
      })
    );
    triggerHaptic('success');
  };

  const toggleOnline = () => {
    setRiderStats((prev) => ({ ...prev, isOnline: !prev.isOnline }));
    triggerHaptic('medium');
  };

  const resetStore = () => {
    setShipments(DEFAULT_SHIPMENTS);
    setRiderStats(DEFAULT_RIDER_STATS);
    setActiveRole('customer');
    triggerHaptic('medium');
  };

  const value = useMemo(
    () => ({
      activeRole,
      shipments,
      riderStats,
      switchRole,
      createShipment,
      acceptTask,
      updateShipmentStatus,
      reportDelay,
      clearDelay,
      toggleOnline,
      resetStore,
    }),
    [activeRole, shipments, riderStats]
  );

  return <LogiTrackContext.Provider value={value}>{children}</LogiTrackContext.Provider>;
}

export function useLogiTrack() {
  const context = useContext(LogiTrackContext);
  if (!context) {
    throw new Error('useLogiTrack must be used within a LogiTrackProvider');
  }
  return context;
}
