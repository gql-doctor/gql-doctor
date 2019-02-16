import { Context } from 'probot';

interface Payload {
  installation: {
    account: {
      login: string;
    };
  };
  repositories: { name: string }[];
}

export async function created(context: Context): Promise<void> {
  const { installation, repositories }: Payload = context.payload;
  const owner = installation.account.login;

  repositories.forEach(async repository => {
    const repo = repository.name;
    const name = 'gql-doctor-config';

    const reference = await context.github.gitdata.getRef({
      repo,
      owner,
      ref: 'heads/master',
    });

    const response = await context.github.gitdata.createRef({
      repo,
      owner,
      ref: `refs/heads/${name}`,
      sha: reference.data.object.sha,
    });
  });
}
