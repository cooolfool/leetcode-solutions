class Solution {
    public boolean hasSpecialSubstring(String s, int k) {
        int len = s.length();
        if (len == 1)
            return true;
        int count = 1;
        for (int i = 0; i < len - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                count++;
            } else if ((s.charAt(i) != s.charAt(i + 1))) {
                if (count == k)
                    return true;
                else
                count = 1;    
            } 
            if(i==(len-2)  && count==k){
                return true;
            }
        }
        return false;
    }
}