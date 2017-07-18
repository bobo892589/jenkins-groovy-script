def accounts = ['user1','user2']
for(int i = 0;i<accounts.size;i++) {
  println(accounts.get(i))
  jenkins.model.Jenkins.instance.securityRealm.createAccount(accounts.get(i), accounts.get(i))
}
