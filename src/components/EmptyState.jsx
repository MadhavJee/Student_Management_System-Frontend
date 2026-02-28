import { HiOutlineInbox } from 'react-icons/hi2';

export default function EmptyState({ icon: Icon = HiOutlineInbox, title = 'No data found', description = '', action }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-3xl) var(--spacing-xl)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
        }}>
            <Icon size={48} style={{ marginBottom: 'var(--spacing-base)', opacity: 0.5 }} />
            <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-sm)',
            }}>{title}</h3>
            {description && (
                <p style={{ fontSize: 'var(--font-size-sm)', maxWidth: '320px' }}>{description}</p>
            )}
            {action && <div style={{ marginTop: 'var(--spacing-lg)' }}>{action}</div>}
        </div>
    );
}
