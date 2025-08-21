class Solution {
public:
    bool checkString(string s) {
        /*int temp=0;
        
        for(int i=0;i<n;i++){
            if(s[i]=='b')
                temp=i;
        }*/
        int n=s.length();
        if(n>1){
        //int x=s.find_last_of('a');
            size_t x=s.find('a');
            int n=s.find_last_of('a');
            size_t y=s.find('b');
        //int y=s.find_first_of('b');
            if(x!=string::npos && y!=string::npos){
                 if( n>y)
            return false;
        else return true; 
}
            else 
                return true;
        
        }
        else return true;
    }
};