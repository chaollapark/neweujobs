import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - Best in Brussels | EU Jobs Brussels',
    default: 'Best in Brussels - EU Public Affairs Directory',
  },
  description: 'Comprehensive directory of EU public affairs consultancies, consultants, law firms, and more in Brussels.',
};

export default function BibLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
