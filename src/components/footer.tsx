export function Footer() {
    return (
        <footer className="bg-secondary">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} CabSafe. All rights reserved. Drive safe.
                </p>
            </div>
        </footer>
    );
}
