class Solution {
    public boolean isSubsequence(String s, String t) {
        int relPos=-1;
        boolean flag=false;
        if(s.length()==0)
        return true;
       for(int i=0;i<s.length();i++){
           char ch = s.charAt(i);
        //    if(!flag)
        //    return flag;    
            for(int j=0;j<t.length();j++){
               // System.out.println(t.charAt(j)+"   "+ch);
                if(t.charAt(j)==ch && j>relPos){
                    relPos=j;
                    flag=true;
                    break;
                }
                else if(j==t.length()-1)
                return false;
                else{
                    flag= false;
                }
            }
       }
       return flag;
    }
}