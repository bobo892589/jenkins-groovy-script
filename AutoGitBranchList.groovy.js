import com.cloudbees.plugins.credentials.domains.Domain
def credentialsStore = jenkins.model.Jenkins.instance.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()

def creds = credentialsStore.getCredentials(Domain.global())
def cred = null

for (tempCred in creds) {
  if (tempCred.username == "jenkins-iOS") {
    cred = tempCred
  }
}

File.createTempFile("temp", ".tmp").with {
  write cred.privateKey "chmod 0600 $absolutePath".execute()
  def gitURL = "git ssh path"
  "ssh-add $absolutePath".execute()
  def command = "git ls-remote -h $gitURL"
  println command
  def proc = command.execute()
  proc.waitFor()

  if (proc.exitValue() != 0) {
    println "Error, ${proc.err.text}"
  }
  // def branches = proc.in.text.readLines().collect {
  // it.replaceAll(/[a-z0-9]*\trefs\/heads\//, '')
  //}
  def branchesNew = [];
  def branches = proc.in.text.readLines()
  for (branch in branches) {
    branch = branch.replaceAll(/[a-z0-9]*\trefs\/heads\//, '')
    //过滤分支
    if (branch == ~/develop_\d{4}/) {
      branchesNew.add(branch)
    }

  }
  branchesNew.add("develop")
  return branchesNew.sort {
    a,
    b - >
    return b.compareTo(a)
  }
}
