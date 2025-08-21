class Solution {
    public String reverseWords(String s) {
        String[] str= s.split(" ",s.length());
        String res="";
        Collections.reverse(Arrays.asList(str)); 
        //return Arrays.toString(str);
        for(int i=0;i<str.length;i++){
            if(!str[i].trim().isEmpty())
            res+=str[i].trim()+" ";
        }
        return res.trim();
    }
}