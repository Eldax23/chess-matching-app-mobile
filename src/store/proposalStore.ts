import { create } from 'zustand';
import { apiClient } from '@services/api';
import { ProposalState, CreateProposalRequest } from '@/types';

export const useProposalStore = create<
  ProposalState & {
    createProposal: (data: CreateProposalRequest) => Promise<string>;
    fetchIncomingProposals: () => Promise<void>;
    fetchOutgoingProposals: () => Promise<void>;
    acceptProposal: (proposalId: string) => Promise<import('@/types').AcceptProposalResponse>;
    rejectProposal: (proposalId: string, reason?: string) => Promise<void>;
    cancelProposal: (proposalId: string) => Promise<void>;
    clearError: () => void;
  }
>((set, get) => ({
  incomingProposals: [],
  outgoingProposals: [],
  isLoading: false,
  error: null,

  createProposal: async data => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createProposal(data);

      // Add to outgoing proposals
      const outgoing = get().outgoingProposals;
      set({
        outgoingProposals: [
          ...outgoing,
          {
            id: response.id,
            proposer: { id: '', username: '', hasBoard: false },
            status: response.status,
            message: response.message,
            meetingLocation: response.meetingLocation,
            distanceFromYouKm: 0,
            expiresAt: response.expiresAt,
            createdAt: response.createdAt,
          },
        ],
        isLoading: false,
      });

      return response.id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create proposal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchIncomingProposals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getIncomingProposals();
      set({
        incomingProposals: response.proposals || [],
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch proposals';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchOutgoingProposals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getOutgoingProposals();
      set({
        outgoingProposals: response.proposals || [],
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch proposals';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  acceptProposal: async proposalId => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.acceptProposal(proposalId);

      // Remove from incoming
      const incoming = get().incomingProposals;
      set({
        incomingProposals: incoming.filter(p => p.id !== proposalId),
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to accept proposal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  rejectProposal: async (proposalId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.rejectProposal(proposalId, reason);

      // Remove from incoming
      const incoming = get().incomingProposals;
      set({
        incomingProposals: incoming.filter(p => p.id !== proposalId),
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reject proposal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  cancelProposal: async proposalId => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.cancelProposal(proposalId);

      // Remove from outgoing
      const outgoing = get().outgoingProposals;
      set({
        outgoingProposals: outgoing.filter(p => p.id !== proposalId),
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel proposal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
