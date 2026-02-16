'use client';

import { EmailClientsViewClient } from './EmailClientsViewClient';
import type { Dictionary } from '@repo/internationalization';
import type { ClientForTableWithStatus } from '@repo/data-services';
import type { EmailTemplateData } from '@repo/data-services';

// Test emails for development
const TEST_EMAILS = ['heredialucasfac22@gmail.com', 'nicolascaliari28@gmail.com'];

interface EmailClientsViewServerProps {
    category?: string;
    type?: string;
    visibility?: 'all' | 'hidden' | 'visible';
    dictionary: Dictionary;
    clients: ClientForTableWithStatus[];
    emailTemplates: EmailTemplateData[];
    paginationInfo?: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
    };
}

export function EmailClientsViewServer(props: EmailClientsViewServerProps) {
    return (
        <EmailClientsViewClient
            {...props}
        />
    );
} 