import { HomeLayout } from '@/components/geistdocs/home-layout';

const Layout = ({ children }: LayoutProps<'/'>) => (
  <HomeLayout>
    <div className="bg-sidebar">{children}</div>
  </HomeLayout>
);

export default Layout;
