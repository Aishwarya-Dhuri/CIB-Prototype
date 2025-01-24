export class CorporateCluster {
  public clusterName: string;
  public copyClusterFromExisting: string;
  public copyClusterFromExistingName: string;
  public effectiveFrom: string;
  public effectiveTill: string;
  public clusterDetails: ClusterDetail[];

  constructor() {
    this.clusterName = '';
    this.copyClusterFromExisting = '';
    this.copyClusterFromExistingName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.clusterDetails = [];
  }
}

export class ClusterDetail {
  public printBranch: string;
  public branches: string;

  constructor() {
    this.printBranch = '';
    this.branches = '';
  }
}
