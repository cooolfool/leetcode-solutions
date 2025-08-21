class Solution {
    public String longestCommonPrefix(String[] strs) {
        String res="";
        String temp="";
        int len=strs.length;
        int min=500;
        for(String s:strs){
            if(s.length()<min){
            min=s.length();
            temp=s;
            }
        }
        for(int i=0;i<min;i++){
            char c=temp.charAt(i);
            for(int j=0;j<len;j++){
                if(strs[j].charAt(i)!=c)
                return res;
            }
            res+=c;
        }
        return res;
    }
}