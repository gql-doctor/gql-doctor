import { Context } from 'probot';
import configTemplate from '../configTemplate';

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
    const branch = 'gql-doctor-config';

    const master = await context.github.gitdata.getRef({
      owner,
      repo,
      ref: 'heads/master',
    });

    await context.github.gitdata.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: master.data.object.sha,
    });

    await context.github.repos.createFile({
      owner,
      repo,
      path: 'gql-doctor.json',
      message: 'Add gql-doctor.json',
      content: configTemplate,
      branch,
    });

    await context.github.pullRequests.create({
      owner,
      repo,
      title: 'Configure GQL-DOCTOR',
      head: branch,
      base: 'master',
    });
  });
}
