export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>&copy; {new Date().getFullYear()} ShopHub. Built with React, Node.js & MongoDB.</p>
      </div>
    </footer>
  );
}
