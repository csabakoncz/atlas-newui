FROM gitpod/workspace-full-vnc

USER root

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# More information: https://www.gitpod.io/docs/42_config_docker/
RUN apt-get update \
   && apt-get install -y \
      libnss3-dev libgbm1 \
   && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*