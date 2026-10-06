const UsersListLoading = () => {
  // Theme CSS variables so the overlay follows light/dark mode
  const styles = {
    borderRadius: '0.475rem',
    boxShadow: 'var(--bs-box-shadow)',
    backgroundColor: 'var(--bs-body-bg)',
    color: 'var(--bs-gray-600)',
    fontWeight: '500',
    margin: '0',
    width: 'auto',
    padding: '1rem 2rem',
    top: 'calc(50% - 2rem)',
    left: 'calc(50% - 4rem)',
  }

  return <div style={{...styles, position: 'absolute', textAlign: 'center'}}>Processing...</div>
}

export {UsersListLoading}
