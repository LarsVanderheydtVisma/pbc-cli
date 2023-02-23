import { PageData, PageLoader } from '@Component/PageLoader';
import { RouteData } from '@General/Router';
import { Team } from '@General/Team';

const Page = (): JSX.Element => (
    <PageLoader
        loader={async (): Promise<PageData> =>
            import('./[name]').then((m) => m.page)
        }
    />
);

export const route: RouteData = {
    component: Page,
    path: '/execute/[name]',
    title: () => '[name]',
    theme: 'bank',
    team: Team.PBC,
};
