class Solution {
    public boolean isPalindrome(String str) {
       String s= str.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        System.out.println(s);
        for(int i=0;i<s.length()/2;i++){
                if(s.charAt(i)!=s.charAt(s.length()-i-1))
                return false;
        }
        return true;
    }
}