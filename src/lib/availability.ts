
'use client';

import { db } from './firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { format, eachDayOfInterval } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { Availability } from './types';

interface SavePayload {
    doctorId: string;
    dateRange: DateRange;
    isAllDay: boolean;
    timeSlots: { startTime: string; endTime: string }[];
    breaks: { startTime: string; endTime: string }[];
}

const generateTimeSlots = (start: string, end: string, breakTimes: {start: string, end: string}[], intervalMinutes = 30): string[] => {
    const slots: string[] = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    
    const parsedBreaks = breakTimes.map(b => ({
        start: new Date(`1970-01-01T${b.start}:00`),
        end: new Date(`1970-01-01T${b.end}:00`),
    }));

    while (currentTime < endTime) {
        let inBreak = false;
        for (const breakTime of parsedBreaks) {
            if (currentTime >= breakTime.start && currentTime < breakTime.end) {
                inBreak = true;
                break;
            }
        }
        if (!inBreak) {
            slots.push(format(currentTime, 'HH:mm'));
        }
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    return slots;
}

export const saveAvailability = async (payload: SavePayload) => {
    if (!payload.dateRange.from) {
        throw new Error("A start date must be provided in the date range.");
    }
    const batch = writeBatch(db);
    const days = eachDayOfInterval({
        start: payload.dateRange.from,
        end: payload.dateRange.to || payload.dateRange.from
    });

    const finalTimeSlots: string[] = [];
    if (!payload.isAllDay) {
       payload.timeSlots.forEach(slot => {
            finalTimeSlots.push(...generateTimeSlots(slot.startTime, slot.endTime, payload.breaks));
       });
    }

    days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const availabilityRef = doc(db, 'users', payload.doctorId, 'availability', dateStr);
        const data: Availability = {
            id: dateStr,
            doctorId: payload.doctorId,
            isAvailable: !payload.isAllDay && finalTimeSlots.length > 0,
            slots: finalTimeSlots,
        };
        batch.set(availabilityRef, data);
    });

    await batch.commit();
};


export const getDoctorAvailability = async (doctorId: string, date: string): Promise<Availability | null> => {
    const availabilityRef = doc(db, 'users', doctorId, 'availability', date);
    const docSnap = await getDoc(availabilityRef);
    if (docSnap.exists()) {
        return docSnap.data() as Availability;
    }
    return null;
}
