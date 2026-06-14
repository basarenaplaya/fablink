import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { ServiceRequest } from '@/types';

const REQUESTS_COLLECTION = 'requests';

export class RequestServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestServiceError';
  }
}

function mapRequestDocument(
  id: string,
  data: Omit<ServiceRequest, 'id'>,
): ServiceRequest {
  return { id, ...data };
}

function sortByCreatedAtDesc(requests: ServiceRequest[]): ServiceRequest[] {
  return [...requests].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

async function getOwnedRequest(
  id: string,
  userId: string,
): Promise<ServiceRequest> {
  const request = await getServiceRequestById(id);

  if (!request) {
    throw new RequestServiceError('Request not found');
  }

  if (request.userId !== userId) {
    throw new RequestServiceError('Unauthorized');
  }

  return request;
}

export async function createServiceRequest(
  request: ServiceRequest,
): Promise<ServiceRequest> {
  await setDoc(doc(db, REQUESTS_COLLECTION, request.id), request);
  return request;
}

export async function listPendingServiceRequests(): Promise<ServiceRequest[]> {
  const pendingQuery = query(
    collection(db, REQUESTS_COLLECTION),
    where('status', '==', 'pending'),
  );
  const snapshot = await getDocs(pendingQuery);

  const requests = snapshot.docs.map((document) =>
    mapRequestDocument(
      document.id,
      document.data() as Omit<ServiceRequest, 'id'>,
    ),
  );

  return sortByCreatedAtDesc(requests);
}

/** @deprecated Use listPendingServiceRequests */
export const listServiceRequests = listPendingServiceRequests;

export async function listUserServiceRequests(
  userId: string,
): Promise<ServiceRequest[]> {
  const userQuery = query(
    collection(db, REQUESTS_COLLECTION),
    where('userId', '==', userId),
  );
  const snapshot = await getDocs(userQuery);

  const requests = snapshot.docs.map((document) =>
    mapRequestDocument(
      document.id,
      document.data() as Omit<ServiceRequest, 'id'>,
    ),
  );

  return sortByCreatedAtDesc(requests);
}

export async function getServiceRequestById(
  id: string,
): Promise<ServiceRequest | null> {
  const snapshot = await getDoc(doc(db, REQUESTS_COLLECTION, id));

  if (!snapshot.exists()) {
    return null;
  }

  return mapRequestDocument(
    snapshot.id,
    snapshot.data() as Omit<ServiceRequest, 'id'>,
  );
}

export async function closeServiceRequest(
  id: string,
  userId: string,
): Promise<ServiceRequest> {
  const request = await getOwnedRequest(id, userId);

  if (request.status === 'closed') {
    return request;
  }

  await updateDoc(doc(db, REQUESTS_COLLECTION, id), { status: 'closed' });

  return { ...request, status: 'closed' };
}

export async function deleteServiceRequest(
  id: string,
  userId: string,
): Promise<void> {
  await getOwnedRequest(id, userId);
  await deleteDoc(doc(db, REQUESTS_COLLECTION, id));
}
