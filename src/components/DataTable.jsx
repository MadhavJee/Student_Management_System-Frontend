import { HiMagnifyingGlass, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import EmptyState from './EmptyState';
import Loader from './Loader';
import './DataTable.css';

export default function DataTable({
    columns,
    data,
    loading = false,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    pagination,
    onPageChange,
    toolbar,
    emptyTitle = 'No data found',
    emptyDescription = '',
}) {
    const totalPages = pagination?.pages || 1;
    const currentPage = pagination?.page || 1;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="data-table-wrapper">
            <div className="data-table-toolbar">
                {onSearchChange && (
                    <div className="data-table-search">
                        <HiMagnifyingGlass size={16} className="data-table-search-icon" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                        />
                    </div>
                )}
                {toolbar && <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>{toolbar}</div>}
            </div>

            {loading ? (
                <Loader />
            ) : data.length === 0 ? (
                <EmptyState title={emptyTitle} description={emptyDescription} />
            ) : (
                <>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th key={col.key} style={col.width ? { width: col.width } : {}}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, idx) => (
                                    <tr key={row._id || idx}>
                                        {columns.map((col) => (
                                            <td key={col.key}>
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && totalPages > 1 && (
                        <div className="data-table-pagination">
                            <div className="data-table-pagination-info">
                                Showing {((currentPage - 1) * (pagination.limit || 10)) + 1} to{' '}
                                {Math.min(currentPage * (pagination.limit || 10), pagination.total)} of{' '}
                                {pagination.total} results
                            </div>
                            <div className="data-table-pagination-controls">
                                <button
                                    className="data-table-pagination-btn"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    <HiChevronLeft size={16} />
                                </button>
                                {getPageNumbers().map((p) => (
                                    <button
                                        key={p}
                                        className={`data-table-pagination-btn ${p === currentPage ? 'active' : ''}`}
                                        onClick={() => onPageChange(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="data-table-pagination-btn"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    <HiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
